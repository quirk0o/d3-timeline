import React, { useRef, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { select, selectAll } from "d3-selection";
import * as axis from "d3-axis";
import { timeMonth } from "d3-time";
import { timeFormat } from "d3-time-format";
import "d3-selection-multi";
import { scaleTime } from "d3-scale";
import PropTypes from "prop-types";

const d3 = Object.assign(
  {},
  { select, selectAll, scaleTime, timeMonth, timeFormat },
  axis
);

var testData = [
  {
    start: new Date(2020, 5, 1),
    end: new Date(2020, 8, 1),
    color: "#fcb0ab",
    label: "Career Exploration"
  },
  {
    start: new Date(2020, 8, 1),
    end: new Date(2020, 10, 1),
    color: "#123bbd",
    label: "Job Search"
  }
];

const Axis = ({
  scale,
  position = "bottom",
  tickStyle = {},
  domainStyle = {},
  ...props
}) => {
  const ref = useRef();

  useLayoutEffect(() => {
    const factory = {
      bottom: d3.axisBottom,
      top: d3.axisTop,
      left: d3.axisLeft,
      right: d3.axisRight
    }[position];
    const axis = factory(scale);
    axis.ticks(d3.timeMonth, 1).tickFormat(d3.timeFormat("%b"));
    d3.select(ref.current)
      .call(axis)
      .call(g => g.select(".domain").styles(domainStyle))
      .call(g => g.selectAll(".tick line").styles(tickStyle));
  }, [ref, scale, position, domainStyle, tickStyle]);

  return <g id={`axis-${position}`} ref={ref} {...props} />;
};

Axis.propTypes = {
  scale: PropTypes.func.isRequired,
  position: PropTypes.oneOf([["top", "bottom", "left", "right"]]),
  tickSTyle: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  domainStyle: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  )
};

const AXIS_STYLE = { stroke: "none" };
const TICK_STYLE = { stroke: "#eee" };
const Timeline = ({ start, end, ranges = [] }) => {
  const x = d3
    .scaleTime()
    .domain([start, end])
    .range([0, 400]);

  return (
    <svg width={480}>
      <g transform="translate(40, 40)">
        <g id="timeline" transform="translate(0, 10)">
          <rect
            x={x(start)}
            width={x(end) - x(start)}
            height={8}
            fill="#eeeeee"
          />
          {ranges.map(datum => (
            <g key={datum.start}>
              <text
                x={x(datum.start) + (x(datum.end) - x(datum.start)) / 2}
                transform="translate(0, -10)"
                style={{ font: "bold 12px sans-serif" }}
                textAnchor="middle"
              >
                {datum.label}
              </text>
              <rect
                x={x(datum.start)}
                width={x(datum.end) - x(datum.start)}
                height={8}
                fill={datum.color}
              />
            </g>
          ))}
        </g>
        <Axis
          position="bottom"
          scale={x}
          domainStyle={AXIS_STYLE}
          tickStyle={TICK_STYLE}
          transform="translate(0, 20)"
        />
      </g>
    </svg>
  );
};

const rangeShape = {
  start: PropTypes.instanceOf(Date).isRequired,
  end: PropTypes.instanceOf(Date).isRequired
};

Timeline.propTypes = {
  ...rangeShape,
  ranges: PropTypes.arrayOf(PropTypes.shape(rangeShape))
};

Timeline.propTypes = {
  ...rangeShape,
  ranges: PropTypes.arrayOf(PropTypes.shape(rangeShape))
};

ReactDOM.render(
  <Timeline
    start={new Date(2020, 4, 1)}
    end={new Date(2020, 12, 1)}
    ranges={testData}
  />,
  document.getElementById("container")
);
