/* eslint-disable react/prop-types */
const FormRow = (props) => {
  return (
    <div className="form-row">
      <label htmlFor={props.name} className="form-label">
        {props.labelText}
      </label>
      <input
        type={props.type}
        id={props.name}
        name={props.name}
        className="form-input"
        defaultValue={props.defaultValue || ""}
        required
      ></input>
    </div>
  );
};

export default FormRow;
