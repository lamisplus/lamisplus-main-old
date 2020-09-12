import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  //const [formData, updateFormData] = useState();

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
    

  };

  const onSubmit = async e => {
    e.preventDefault();   
    console.log(file)
    const form_Data = new FormData();
    form_Data.append('file1', file);
    //console.log(getFiledetails)

    const token ='eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhYmNAbWFpbC5jb20iLCJhdXRoIjoiUk9MRV9BRE1JTiIsImV4cCI6MTYwMDEyNzY5Mn0.a-SMbK3ucT15Kyk9nM_NU1gJveSWnn3OzC4iaVzT8UdKIh6rMvrFuMxdfbGLR5arCCikOCi-PXfdjF5pjQ11Mg'
     
    try {
      const res = await axios.post('https://lp-base.herokuapp.com/api/modules/upload', form_Data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );

          // Clear percentage
          setTimeout(() => setUploadPercentage(0), 10000);
        }
      });
      console.log(res)
      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });

      setMessage('File Uploaded');
    } catch (err) {
      console.log(err)
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>

        <Progress percentage={uploadPercentage} />

        <input
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4'
        />
      </form>
      {uploadedFile ? (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
            <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;
