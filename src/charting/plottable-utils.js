import { Scales, Axes, Components, Plots, Dataset } from 'plottable';
import find from 'lodash/find';

export const createXScale = () => {
    const scale = new Scales.Category();
    scale.outerPadding(0);
    return scale;
};

export const createYScale = () => {
    const scale = new Scales.Linear();
    scale.addIncludedValuesProvider(() => [0]);
    scale.addPaddingExceptionsProvider(() => [0]);
    scale.snappingDomainEnabled(true);
    return scale;
};

export const createColorScale = (seriesNames, colors) => {
    const scale = new Scales.Color();
    scale.domain(seriesNames);
    scale.range(colors);
    return scale;
};

export const createXAxis = (scale, data) => {
    const axis = new Axes.Category(scale, 'bottom');
    axis.tickLabelPadding(5);
    axis.formatter((str) => {
        const index = parseInt(str, 10);
        const series = find(data, s => s.length > index);
        return series[index].label;
    });
    return axis;
};

export const createYAxis = (scale) => {
    const axis = new Axes.Numeric(scale, 'left');
    axis.formatter(d => d.toLocaleString());
    return axis;
};

const lineSymbolFactory = (size) => {
    const halfSize = size / 2;
    return `M ${-halfSize},1 L ${halfSize},1, ${halfSize},-1 ${-halfSize},-1 Z`;
};

export const createLegend = (scale) => {
    const legend = new Components.Legend(scale);
    legend.yAlignment('center');
    legend.maxEntriesPerRow(1);
    legend.symbol(() => lineSymbolFactory);
    return legend;
};

export const createSeriesPlot = (series, name, scales) => {
    const plot = new Plots.Line();
    plot.x((d, index) => String(index), scales.x);
    plot.y(d => parseFloat(d.fieldValue), scales.y);
    plot.attr('stroke', name, scales.color);
    plot.attr('stroke-width', '1px');

    const dataset = new Dataset(series);
    plot.addDataset(dataset);
    return plot;
};