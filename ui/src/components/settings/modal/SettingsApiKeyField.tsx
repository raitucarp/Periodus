import React from 'react'
import { Field, Input } from '@chakra-ui/react'

export interface SettingsApiKeyFieldProps {
  label: string
  placeholder: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function SettingsApiKeyField({ label, placeholder, value, onChange }: SettingsApiKeyFieldProps) {
  return (
    <Field.Root mb="5">
      <Field.Label textStyle="modal.fieldLabel">
        {label}
      </Field.Label>
      <Input
        type="password"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        size="md"
        bg="bg.subtle"
        borderColor="border.subtle"
        color="fg"
        focusRingColor="ruby.focusRing"
      />
    </Field.Root>
  )
}
