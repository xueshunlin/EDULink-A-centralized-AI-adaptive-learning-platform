import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./IconButton.module.css";

const IconButton = ({ className = "", propTop, propLeft }) => {
  const stTrailingIconStyle = useMemo(() => {
    return {
      top: propTop,
      left: propLeft,
    };
  }, [propTop, propLeft]);

  return (
    <div
      className={[styles.stTrailingIcon, className].join(" ")}
      style={stTrailingIconStyle}
    >
      <div className={styles.container}>
        <div className={styles.stateLayer}>
          <img className={styles.icon} alt="" />
        </div>
      </div>
    </div>
  );
};

IconButton.propTypes = {
  className: PropTypes.string,

  /** Style props */
  propTop: PropTypes.any,
  propLeft: PropTypes.any,
};

export default IconButton;
