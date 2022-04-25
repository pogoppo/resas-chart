import * as echarts from 'echarts';
import type { EChartOption } from "echarts";

import ResasHub, { type Population } from '$lib/repositories/resas-hub';
import { prefecturesMap } from '$lib/stores/prefectures-map';
import { get } from 'svelte/store';

type Cache = {
  [prefCode: number]: {
    seriesData: (string | number)[][]
    xAxisOrderedData: number[]
  }
}

export default class {
  processing = false;
  chart: echarts.EChartsType;
  private xAxisData: Set<string> = new Set();
  private series: EChartOption.Series[] = [];
  private cache: Cache = {};

  constructor(render: HTMLElement) {
    this.chart = echarts.init(render, 'resas');
    this.chart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        name: '年度',
        boundaryGap: false,
        data: [...this.xAxisData]
      },
      yAxis: {
        type: 'value',
        name: '人口数',
        boundaryGap: [0, '20%'],
        axisLabel: {
          formatter(value: number) {
            switch (true) {
              case value >= 10000:
                return `${Math.round(value / (10000 / 10)) / 10}万`;
            }
            return value;
          }
        }
      },
      series: this.series
    });
  }

  async update(prefCodeList: number[]) {
    if (this.processing) {
      return;
    }

    this.processing = true;

    this.clear();

    for (const prefCode of prefCodeList) {
      const timer = new Promise(resolve => setTimeout(resolve, 250)); // throttle用タイマー
      const process = this.add(prefCode);
      await Promise.all([timer, process]);
    }

    // `replaceMerge`等のオプションを考慮した型になっていないが、このオプションは実装されている
    // 解決するまで`Unexpected any.`の警告は残す
    // https://github.com/apache/echarts/issues/6202#issuecomment-974761211
    this.chart.setOption({
      xAxis: {
        data: [...this.xAxisData]
      },
      series: [...this.series]
    }, {
      replaceMerge: ['series']
    } as any);

    this.processing = false;
  }

  private async add(prefCode: number) {
    if (prefCode in this.cache) {
      this.addFromCache(prefCode);
    } else {
      this.cache[prefCode] = {
        seriesData: [],
        xAxisOrderedData: []
      };
      const resasHubRepo = new ResasHub();
      const rawChartData = await resasHubRepo.getPopulation(prefCode);
      this.addXAxisData(rawChartData);
      this.addSeries(rawChartData);
    }
  }

  private addXAxisData(rawChartData: Population) {
    const prefCode = rawChartData.prefCode;
    const xAxisUnorderedData = rawChartData.data.map((obj) => {
      return obj.year;
    });
    const xAxisOrderedData = xAxisUnorderedData.sort((a, b) => a - b);
    this.cache[prefCode].xAxisOrderedData = xAxisOrderedData;
    xAxisOrderedData.forEach((year) => {
      this.xAxisData.add(String(year));
    });
  }

  private addSeries(rawChartData: Population) {
    const prefCode = rawChartData.prefCode;
    const seriesData = rawChartData.data.map((obj) => {
      return [String(obj.year), obj.value];
    });
    this.cache[prefCode].seriesData = seriesData;
    const prefectures = get(prefecturesMap);
    this.series = [...this.series, {
      name: prefectures[prefCode],
      type: 'line',
      data: seriesData
    }];
  }

  private addFromCache(prefCode: number) {
    this.cache[prefCode].xAxisOrderedData.forEach((year) => {
      this.xAxisData.add(String(year));
    });
    const prefectures = get(prefecturesMap);
    this.series = [...this.series, {
      name: prefectures[prefCode],
      type: 'line',
      data: this.cache[prefCode].seriesData
    }];
  }

  private clear() {
    this.xAxisData.clear();
    this.series = [];
  }
}

