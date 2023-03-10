import React, {
  memo,
  useState,
  useEffect,
} from "react";
import './slider.css'
const Slider = memo(
  ({ classes, label, onChange, value, ...sliderProps }) => {
    const [sliderVal, setSliderVal] = useState(0);
    const [mouseState, setMouseState] = useState(null);

    useEffect(() => {
      var value = 29/364*100
      document.getElementById("myRange").style.background = 'linear-gradient(90deg, #a6daad, #53f369  ' + value + '%, #232323 ' + value + '%, #232323 100%)';
    }, []);

    useEffect(() => {
      setSliderVal(value);
      document.getElementById("myRange").oninput = function() {
			// console.log('Hello');
		var value = (this.value-this.min)/(this.max-this.min)*100
		this.style.background = 'linear-gradient(90deg, #a6daad, #53f369  ' + value + '%, #232323 ' + value + '%, #232323 100%)'
      }
    }, [value]);

    const changeCallback = e => {
      setSliderVal(e.target.value);
      onChange(e.target.value);
    };

    useEffect(() => {
      if (mouseState === "up" || mouseState === "move") {
        onChange(sliderVal);
      }
    }, [mouseState]);
    // console.log("RENDER");
    return (
        <>
      <div className="range-container">
        <span>{sliderVal} {sliderVal === 1 ? "day" : 'days'}</span>
        <input
          type="range"
          value={sliderVal}
          {...sliderProps}
          className={`slider ${classes}`}
          id="myRange"
          onChange={changeCallback}
          onMouseDown={() => setMouseState("down")}
          onMouseUp={() => setMouseState("up")}
        />
      </div>
      </>
    );
  }
);

export default Slider;