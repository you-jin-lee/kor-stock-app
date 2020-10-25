import React from "react";
import "./News.css";

const News = ({ subject, summary, link }) => {
  return (
    <div className="news">
      <div className="subject">
        <a href={link} target="_blank">
          {subject}
        </a>
      </div>
      <div className="summary">{summary}</div>
    </div>
  );
};

export default News;
