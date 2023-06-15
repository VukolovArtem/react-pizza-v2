import React from "react";

const ErrorInfo = () => {
  return (
    <div className="content__error-info">
      <h2>
        ОШИБКА 404<span>🤒</span>
      </h2>
      <p>
        Произошла непредвиденая ошибка!
        <br /> К сожалению не получилось получить питсы. Попробуйте повторить
        попытку позже.
      </p>
    </div>
  );
};

export default ErrorInfo;
