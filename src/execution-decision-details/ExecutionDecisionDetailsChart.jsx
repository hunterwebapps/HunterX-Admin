import { ColorType, createChart } from 'lightweight-charts';
import { object } from 'prop-types'
import { useEffect, useMemo, useRef } from 'react'

ExecutionDecisionDetailsChart.propTypes = {
  details: object.isRequired,
}

export default function ExecutionDecisionDetailsChart({ details }) {
  const chartContainerRef = useRef()
  /** @type {import('react').MutableRefObject<import('lightweight-charts').IChartApi>} */
  const chartRef = useRef();

  const candleSticks = useMemo(() => details.bars.toReversed().map(x => ({
    time: Date.parse(x.date) / 1000,
    ...x,
  })), [details.bars])

  const volumeData = useMemo(() => details.bars.toReversed().map(x => ({
    time: Date.parse(x.date) / 1000,
    value: x.volume || 0,
  })), [details.bars])

  const shortEMAs = useMemo(() => details.indicators.shortEMA
    .filter(x => !!x.ema)
    .map(x => ({
      time: Date.parse(x.date) / 1000,
      value: x.ema || 0,
    })), [details.indicators.shortEMA])

  const longEMAs = useMemo(() => details.indicators.longEMA
    .filter(x => !!x.ema)
    .map(x => ({
      time: Date.parse(x.date) / 1000,
      value: x.ema || 0,
    })), [details.indicators.longEMA])

  const vwma = useMemo(() => details.indicators.volumeWeightedAvgPrice
    .filter(x => !!x.vwap)
    .map(x => ({
      time: Date.parse(x.date) / 1000,
      value: x.vwma || 0,
    })), [details.indicators.volumeWeightedAvgPrice])

  // const macd = useMemo(() => details.executionDecision.movingAverageConvergenceDivergence
  //   .filter(x => !!x.macd))

  const markers = useMemo(() => [
    // {
    //   time: Date.parse(details.executionDecision.signalTime) / 1000,
    //   position: 'aboveBar',
    //   color: '#f68410',
    //   shape: 'arrowDown',
    //   text: `${details.executionDecision.action} Signal`,
    // },
    ...details.indicators.pivots
      .filter(x => !!x.highTrend || !!x.lowTrend)
      .map(x => ({
        time: Date.parse(x.date) / 1000,
        position: x.highTrend ? 'aboveBar' : 'belowBar',
        color: x.highTrend ? '#4bffb5' : '#ff4976',
        shape: x.highTrend ? 'arrowDown' : 'arrowUp',
        text: x.highTrend || x.lowTrend,
      })),
  ], [
    details.executionDecision.signalTime,
    details.executionDecision.action,
    details.indicators.pivots,
  ])

  useEffect(
    () => {
      const handleResize = () => {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }

      chartRef.current = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#111' },
          textColor: '#ccc',
        },
        leftPriceScale: {
          visible: true,
        },
        width: chartContainerRef.current.clientWidth,
        height: 300,
        timeScale: {
          timeVisible: true,
        },
      })
      chartRef.current.timeScale().fitContent()

      const volumeSeries = chartRef.current.addHistogramSeries({
        color: '#182233',
        lineWidth: 2,
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'left',
        overlay: true,
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      volumeSeries.setData(volumeData)

      const candleSeries = chartRef.current.addCandlestickSeries({
        upColor: '#4bffb5',
        downColor: '#ff4976',
        borderDownColor: '#ff4976',
        borderUpColor: '#4bffb5',
        wickDownColor: '#838ca1',
        wickUpColor: '#838ca1',
      })

      candleSeries.setData(candleSticks)

      candleSeries.setMarkers(markers)

      const shortEMASeries = chartRef.current.addLineSeries({
        color: '#4bffb5',
        lineWidth: 2,
      })

      shortEMASeries.setData(shortEMAs)

      const longEMASeries = chartRef.current.addLineSeries({
        color: '#ff4976',
        lineWidth: 2,
      })

      longEMASeries.setData(longEMAs)

      // const vwmaSeries = chartRef.current.addLineSeries({
      //   baseLineColor: '#ccc',
      //   lineWidth: 2,
      // })

      // vwmaSeries.setData(vwma)

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);

        chartRef.current.remove();
      };
    },
    [candleSticks, markers, volumeData, shortEMAs, longEMAs, vwma]
  );

  return (
    <>
      <p>{details.stockBasics.symbol}</p>
      <div ref={chartContainerRef} className="stock-chart" />
    </>
  )
}
