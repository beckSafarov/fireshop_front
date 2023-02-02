import React from 'react'
import { Form } from 'react-bootstrap'
import { Field, ErrorMessage } from 'formik'

const FormikFieldGroup = ({
  formField: f,
  hidden,
  isMandatoryField,
  readOnly,
  ...rest
}) => {
  const isInvalid = (f, p) => f.touched[p] && f.errors[p]
  return (
    <Form.Group controlId={f.name} hidden={hidden}>
      <Field name={f.name}>
        {({ field, form }) => (
          <>
            {f.type === 'switch' ? (
              <Form.Check
                type='switch'
                variant='info'
                checked={field.value || false}
                name={f.name}
                label={field.value ? 'Admin' : 'Not Admin'}
                {...field}
              />
            ) : (
              <>
                <Form.Label>
                  {f.label}
                  <span className={isMandatoryField ? 'danger-text' : 'hidden'}>
                    *
                  </span>
                </Form.Label>
                <Form.Control
                  type={f.type}
                  readOnly={readOnly}
                  isInvalid={isInvalid(form, f.name)}
                  disabled={f.disabled}
                  {...field}
                  {...rest}
                />
              </>
            )}
          </>
        )}
      </Field>
      <ErrorMessage name={f.name}>
        {(msg) => (
          <Form.Control.Feedback type='invalid'>{msg}</Form.Control.Feedback>
        )}
      </ErrorMessage>
    </Form.Group>
  )
}

FormikFieldGroup.defaultProps = {
  formField: {},
  hidden: false,
  isMandatoryField: false,
  readOnly: false,
}

export default FormikFieldGroup
