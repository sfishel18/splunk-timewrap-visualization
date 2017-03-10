import { Scales, Axes, Components, Plots, Dataset } from 'plottable';
import find from 'lodash/find';

export const createXScale = () => {
    const scale = new Scales.Category();
    scale.outerPadding(0);
    return scale;
};

export const createYScale = () => {
    const scale = new Scales.Linear();
    scale.tickGenerator((scl) => {
        let ticks = scl.defaultTicks();
        if (ticks.length >= 6) {
            ticks = ticks.filter((tick, i) => i % 2 === 0);
        }
        return ticks;
    });
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
    axis.tickLabelPadding(3);
    axis.margin(5);
    axis.formatter((str) => {
        const index = parseInt(str, 10);
        const series = find(data, s => s.length > index);
        return series[index].label;
    });
    return axis;
};

class YAxis extends Axes.Numeric {
    _hideOverflowingTickLabels() {
        // eslint-disable-next-line no-underscore-dangle
        super._hideOverflowingTickLabels();
        // eslint-disable-next-line no-underscore-dangle
        const tickLabels = this._tickLabelContainer.selectAll(`.${Axes.Numeric.TICK_LABEL_CLASS}`);
        tickLabels[0][tickLabels[0].length - 1].style.visibility = 'visible';
    }

    renderImmediately(...args) {
        super.renderImmediately(...args);
        // eslint-disable-next-line no-underscore-dangle
        const tickLabels = this._tickLabelContainer.selectAll(`.${Axes.Numeric.TICK_LABEL_CLASS}`);
        tickLabels[0].forEach(label => label.setAttribute('y', parseFloat(label.getAttribute('y')) + 6));
        window.label = tickLabels[0][1];
    }
}

export const createYAxis = (scale) => {
    const axis = new YAxis(scale, 'left');
    axis.formatter(d => d.toLocaleString());
    axis.showEndTickLabels(true);
    axis.tickLabelPadding(5);
    axis.margin(10);
    return axis;
};

const lineSymbolFactory = (size) => {
    const halfSize = size / 2;
    return `M ${-halfSize},1 L ${halfSize},1, ${halfSize},-1 ${-halfSize},-1 Z`;
};

export const createLegend = (scale, placement = 'right') => {
    if (placement === 'none') {
        return null;
    }
    const legend = new Components.Legend(scale);
    legend.symbol(() => lineSymbolFactory);
    if (placement === 'right') {
        legend.yAlignment('center');
        legend.maxEntriesPerRow(1);
    } else {
        legend.xAlignment('center');
        legend.yAlignment('bottom');
        legend.maxEntriesPerRow(Infinity);
    }
    return legend;
};

export const createSeriesPlot = (series, name, scales, showMarkers = false) => {
    const dataset = new Dataset(series);
    const linePlot = new Plots.Line();
    linePlot.x((d, index) => String(index), scales.x);
    linePlot.y(d => parseFloat(d.fieldValue), scales.y);
    linePlot.attr('stroke', name, scales.color);
    linePlot.attr('stroke-width', '1px');
    linePlot.addDataset(dataset);
    if (!showMarkers) {
        return linePlot;
    }
    const markerPlot = new Plots.Scatter();
    markerPlot.x((d, index) => String(index), scales.x);
    markerPlot.y(d => parseFloat(d.fieldValue), scales.y);
    markerPlot.attr('fill', name, scales.color);
    markerPlot.size(7);
    markerPlot.attr('opacity', 1);
    markerPlot.addDataset(dataset);
    return [linePlot, markerPlot];
};