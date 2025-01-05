import PropTypes from "prop-types";
import styles from "./Next.module.css";

const Next = ({ className = "" }) => {
  return <div className={[styles.next, className].join(" ")} />;
};

Next.propTypes = {
  className: PropTypes.string,
};

export default Next;
