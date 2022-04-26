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
  colorMap: { [prefCode: number]: string } = {};

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
        nameTextStyle: {
          'fontWeight': 'bold'
        },
        boundaryGap: false,
        nameGap: 8,
        data: [...this.xAxisData]
      },
      yAxis: {
        type: 'value',
        name: '人口数',
        nameTextStyle: {
          'fontWeight': 'bold'
        },
        boundaryGap: false,
        offset: -16,
        nameGap: 16,
        axisLabel: {
          showMinLabel: false,
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
      await this.add(prefCode);
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

    this.mapColor(prefCodeList);

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
      const timer = new Promise(resolve => setTimeout(resolve, 250)); // throttle用タイマー
      await Promise.all([timer, rawChartData]);

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

  private mapColor(prefCodeList: number[]) {
    const chartOption = this.chart.getOption();
    const themeColors = chartOption.color;

    if (!themeColors) {
      return;
    }

    prefCodeList.forEach((code, index) => {
      if (themeColors.length > index) {
        this.colorMap[code] = themeColors[index];
      } else {
        this.colorMap[code] = themeColors[index % themeColors.length];
      }
    });
  }

  private clear() {
    this.colorMap = {};
    this.xAxisData.clear();
    this.series = [];
  }
}

