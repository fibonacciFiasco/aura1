import React from 'react'
import { getStatusClass } from '../utils/helpers'

export default function Badge({ status }) {
  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      {status}
    </span>
  )
}
