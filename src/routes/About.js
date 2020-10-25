import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about_container">
      <div className="title">Korea Stock News</div>
      <hr />
      <div className="contents">
        <br />
        <div className="study_content">
          <strong>📝 Study Period</strong> <br />
          2020/10/15 ~ 2020/10/24 <br />
          <br />
          <strong>🗨 Contact</strong> (click)
          <br />
          📧 E-mail{" "}
          <a href="youjinlee1997@gmail.com">(youjinlee1997@gmail.com)</a>
          <br />
          🐙 git{" "}
          <a href="https://github.com/you-jin-lee">
            (https://github.com/you-jin-lee)
          </a>{" "}
          <br />
        </div>
        <div className="project_content">
          <strong>🎯 What I Use </strong>
          <br />
          ✔ ReactJS
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;✔ react-router-dom
          <br />
          ✔ Firebase - Firestore <br />
          ✔ NodeJS, Express <br />
          <br />
          <strong>✨ Deploy</strong> <br />
          ✔ version 1.0 (2020/10/24) <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default About;
