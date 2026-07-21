import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React from 'react';

interface CKEditorProps {
 value: string;
 onChange: (value: string) => void;
}

export default function CKEditorComponent({ value, onChange }: CKEditorProps) {
 return (
  <div className="bg-white rounded-md text-black shadow-sm">
   <CKEditor
    editor={ClassicEditor}
    data={value}
    onChange={(_event, editor) => {
     const data = editor.getData();
     onChange(data);
    }}
    config={{
     placeholder: 'Tulis isi artikel di sini...',
     toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'blockQuote',
      'insertTable',
      'undo',
      'redo',
     ],
    }}
   />
  </div>
 );
}