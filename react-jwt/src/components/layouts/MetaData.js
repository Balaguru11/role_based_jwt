import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";

const MetaData = (props) => {
  return (
    <Helmet>
      <title>{props.title} - JWT App</title>
    </Helmet>
  );
};

MetaData.propTypes = {
  title: PropTypes.string,
};

export default MetaData;
