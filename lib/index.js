"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _raf = require("raf");

var _raf2 = _interopRequireDefault(_raf);

var _reactMotion = require("react-motion");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlipMotion = function (_Component) {
  _inherits(FlipMotion, _Component);

  function FlipMotion(props) {
    _classCallCheck(this, FlipMotion);

    var _this = _possibleConstructorReturn(this, (FlipMotion.__proto__ || Object.getPrototypeOf(FlipMotion)).call(this, props));

    _this.state = {
      shouldMesure: false,
      previousPosition: null,
      transform: null
    };
    _this.children = {};
    return _this;
  }

  _createClass(FlipMotion, [{
    key: "getStyles",
    value: function getStyles() {
      var _this2 = this;

      var children = this.props.children;

      return _react.Children.map(children, function (child, index) {
        return {
          data: child,
          style: _extends({
            x: (0, _reactMotion.spring)(0),
            y: (0, _reactMotion.spring)(0)
          }, _this2.state.transform && _this2.state.transform[child.key] ? _this2.state.transform[child.key] : null, {
            opacity: (0, _reactMotion.spring)(1),
            scale: (0, _reactMotion.spring)(1)
          }),
          key: child.key
        };
      });
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      var prevChildren = _react.Children.toArray(this.props.children);
      var nextChildren = _react.Children.toArray(nextProps.children);
      if (nextChildren.some(function (item, index) {
        return !prevChildren[index] || item.key !== prevChildren[index].key;
      })) {
        this.setState({
          shouldMesure: true,
          previousPosition: Object.keys(this.children).reduce(function (acc, key) {
            if (_this3.children[key]) {
              acc[key] = _this3.children[key].getBoundingClientRect();
            }
            return acc;
          }, {}),
          transform: null
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this4 = this;

      if (this.state.shouldMesure) {
        (0, _raf2.default)(function () {
          _this4.setState({
            shouldMesure: false,
            transform: Object.keys(_this4.children).reduce(function (acc, key) {
              if (!_this4.children[key]) {
                acc[key] = {
                  x: 0,
                  y: 0
                };
                return acc;
              }
              var nextRect = _this4.children[key].getBoundingClientRect();
              if (_this4.state.previousPosition && _this4.state.previousPosition[key]) {
                acc[key] = {
                  x: _this4.state.previousPosition[key].left - nextRect.left,
                  y: _this4.state.previousPosition[key].top - nextRect.top
                };
              }
              return acc;
            }, {}),
            previousPosition: null
          }, function () {
            if (_this4.state.transform) {
              _this4.setState({
                transform: Object.keys(_this4.state.transform).reduce(function (acc, key) {
                  acc[key] = {
                    x: (0, _reactMotion.spring)(0, _this4.props.springConfig),
                    y: (0, _reactMotion.spring)(0, _this4.props.springConfig)
                  };
                  return acc;
                }, {})
              });
              _this4.children = {};
            }
          });
        });
      }
    }
  }, {
    key: "willEnter",
    value: function willEnter() {
      return {
        x: 0,
        y: 0,
        scale: 0.8,
        opacity: 0
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var style = this.props.style;
      var childStyle = this.props.childStyle;
      var Component = this.props.component || "div";
      var ChildComponent = this.props.childComponent || "div";
      return _react2.default.createElement(
        _reactMotion.TransitionMotion,
        {
          styles: this.getStyles(),
          willEnter: this.willEnter
        },
        function (styles) {
          return _react2.default.createElement(
            Component,
            {
              style: style,
              className: _this5.props.className
            },
            styles.map(function (item) {
              return _react2.default.createElement(
                ChildComponent,
                {
                  key: item.key,
                  style: item.style && _extends({}, childStyle, {
                    opacity: item.style.opacity,
                    transform: "translate(" + item.style.x + "px, " + item.style.y + "px) scale(" + item.style.scale + ")",
                    WebkitTransform: "translate(" + item.style.x + "px, " + item.style.y + "px) scale(" + item.style.scale + ")"
                  }),
                  ref: function ref(c) {
                    return _this5.children[item.key] = c;
                  }
                },
                item.data
              );
            })
          );
        }
      );
    }
  }]);

  return FlipMotion;
}(_react.Component);

exports.default = FlipMotion;