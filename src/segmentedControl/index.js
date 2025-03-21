import PropTypes from "prop-types";
import React, { useEffect } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewPropTypes,
} from "react-native";
import { Icon } from "react-native-elements";

const getSegmentedBackgroundColor = (theme, colorValueFromProps) => {
  return colorValueFromProps || (theme === "LIGHT" ? "#E5E5EA" : "#4a5568");
};

const getSegmentedTextColor = (theme, colorValueFromProps) => {
  return colorValueFromProps || (theme === "LIGHT" ? "black" : "white");
};

const getActiveSegmentedBackgroundColor = (theme, colorValueFromProps) => {
  return colorValueFromProps || (theme === "LIGHT" ? "white" : "black");
};

const getActiveSegmentedTextColor = (theme, colorValueFromProps) => {
  return colorValueFromProps || (theme === "LIGHT" ? "black" : "white");
};

const defaultShadowStyle = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.23,
  shadowRadius: 2.62,

  elevation: 4,
};

const SegmentedControl = (props) => {
  const { width, shadowStyle } = props;
  const translateValue = (width) / props?.tabs?.length;
  const [tabTranslate, setTabTranslate] = React.useState(new Animated.Value(0));
  const shadow = shadowStyle || defaultShadowStyle;
  // useCallBack with an empty array as input, which will call inner lambda only once and memoize the reference for future calls
  const memoizedTabPressCallback = React.useCallback(
    (index) => {
      props?.onChange(index);
    },
    [props?.onChange]
  );

  useEffect(() => {
    // If phone is set to RTL, make sure the animation does the correct transition.
    const transitionMultiplier = props?.isRTL ? -1 : 1;

    // Animating the active index based current index

    // if (!props?.disableFlag)
    Animated.spring(tabTranslate, {
      toValue: props?.currentIndex * (transitionMultiplier * translateValue),
      stiffness: props?.disableFlag ? 1500000 : 150,
      damping: props?.disableFlag ? 20000 : 20,
      mass: 1,
      useNativeDriver: true,
    }).start();
  }, [props?.currentIndex]);

  return (
    <Animated.View
      style={[

        styles.segmentedControlWrapper,
        props?.containerStyle,
        {
          width: width,
        },
        {
          backgroundColor: getSegmentedBackgroundColor(
            props?.theme,
            props?.segmentedControlBackgroundColor
          ),
        },
        {
          paddingVertical: props?.paddingVertical,
        },
      ]}
    >
      <Animated.View
        style={[
          {
            ...StyleSheet.absoluteFill,
            position: "absolute",
            width: (width) / props?.tabs?.length,
            top: 0,
            marginVertical: 0,
            marginStart: 0,
            backgroundColor: getActiveSegmentedBackgroundColor(
              props?.theme,
              props?.activeSegmentBackgroundColor
            ),
            borderRadius: 25,
            ...shadow,
            // borderWidth:3
          },
          {
            transform: [
              {
                translateX: tabTranslate,
              },
            ],
          },
          props?.tabStyle
        ]}
      ></Animated.View>
      {props?.tabs.map((tab, index) => {
        const isCurrentIndex = props?.currentIndex === index;
        return (
          <TouchableOpacity
            key={index}
            style={[styles.textWrapper]}
            onPress={() => memoizedTabPressCallback(index)}
            activeOpacity={0.7}
          >
            {props?.isIcon == true ?
              <Icon type={props?.iconType || 'material'} name={tab} size={props?.iconSize || 22} color={isCurrentIndex ? props?.selectedColor : props?.unselectedColor} />
              : <Text
                numberOfLines={1}
                allowFontScaling={false}
                style={[
                  styles.textStyles,
                  props?.textStyle,
                  isCurrentIndex
                    ? {
                      color: getActiveSegmentedTextColor(
                        props?.theme,
                        props?.activeTextColor
                      ),
                      fontWeight: props?.activeTextWeight,
                    }
                    : {
                      color: getSegmentedTextColor(
                        props?.theme,
                        props?.textColor
                      ),
                    },
                ]}
              >
                {tab}
              </Text>}
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  segmentedControlWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
  },
  textWrapper: {
    flex: 1,
    elevation: 9,
    paddingHorizontal: 5,
  },
  textStyles: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },
});

SegmentedControl.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  currentIndex: PropTypes.number.isRequired,
  segmentedControlBackgroundColor: PropTypes.string,
  activeSegmentBackgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  activeTextColor: PropTypes.string,
  activeTextWeight: PropTypes.string,
  paddingVertical: PropTypes.number,
  width: PropTypes.number,
  containerStyle: ViewPropTypes.style,
  textStyle: PropTypes.object,
  isRTL: PropTypes.bool,
  theme: PropTypes.oneOf(["LIGHT", "DARK"]),
  shadowStyle: PropTypes.shape({
    shadowColor: PropTypes.string,
    shadowOffset: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
    }),
    shadowOpacity: PropTypes.number,
    shadowRadius: PropTypes.number,
    elevation: PropTypes.number,
  }),
};

SegmentedControl.defaultProps = {
  tabs: [],
  onChange: () => { },
  currentIndex: 0,
  segmentedControlBackgroundColor: null,
  activeSegmentBackgroundColor: null,
  textColor: null,
  activeTextColor: null,
  activeTextWeight: "600",
  paddingVertical: 12,
  width: Dimensions.get("screen").width - 32,
  containerStyle: {},
  textStyle: {},
  isRTL: false,
  theme: "LIGHT",
  shadowStyle: null,
};

export default SegmentedControl;
