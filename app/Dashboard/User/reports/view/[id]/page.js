'use client';

import { use } from 'react';
import ViewReport from '../ViewReport';

export default function ReportViewPage(props) {
  const params = use(props.params); // unwrap the async param object
  return <ViewReport id={params.id} />;
}
