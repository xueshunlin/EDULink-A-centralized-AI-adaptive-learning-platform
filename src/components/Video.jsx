import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./Video.module.css";

const Video = ({ className = "", propTop, album7 }) => {
  const videoStyle = useMemo(() => {
    return {
      top: propTop,
    };
  }, [propTop]);

  return (
    <div className={[styles.video, className].join(" ")} style={videoStyle}>
      <div className={styles.kViews}>123k views</div>
      <div className={styles.dollieBlair}>Dollie Blair</div>
      <img className={styles.album7Icon} loading="lazy" alt="" src={album7} />
      <b className={styles.selectingTheRight}>Selecting The Right Hotel</b>
      <div className={styles.previewThumbnailsParent}>
        <div className={styles.previewThumbnails} />
        <div className={styles.div}>8:00</div>
      </div>
    </div>
  );
};

Video.propTypes = {
  className: PropTypes.string,
  album7: PropTypes.string,

  /** Style props */
  propTop: PropTypes.any,
};

export default Video;
