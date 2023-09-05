/* eslint-disable react/prop-types */
const FormRow = (props) => {
  return (
    <div className="form-row">
      <label htmlFor={props.id} className="form-label">
        {props.labelText}
      </label>
      <input
        type={props.type}
        id={props.id}
        name={props.id}
        className="form-input"
        value={props.defaultValue || ""}
        required
      ></input>
    </div>
  );
};

export default FormRow;
