import React, { useEffect,useState  } from 'react'
import { Footer, Navbar } from "../components";
import { useSelector } from 'react-redux'
import { RichTextEditor } from '@mantine/rte';
import api from '../api/axios';
const AboutPage = () => {

  const { role_user } = useSelector((state) => state.auth);

  const [content, setContent] = useState('');

  const SubmitAboutUsForm = async() => {

    let newContent=content;

    newContent = newContent.replace(/^<p>|<\/p>$/g, '');

    try {
      // http://localhost:8080/api/auth/updateAboutUs
      const response = await api.post("updateAboutUs", {newContent} ,{
        withCredentials: true
      });
    } catch (error) {
      console.error();
    }
  };

  useEffect(() => {

    const fetchAboutUs = async () => {
      try {
        // http://localhost:8080/api/auth/getAboutUs
        const response = await api.get("getAboutUs");

        setContent(response.data[0].about_us_text);
      } catch (error) {
        console.error();
      }
    };

    fetchAboutUs();
  },[]);

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">About Us</h1>
        <hr />
        {role_user == 0 ? (
          <p className="lead text-center">
            {content}
          </p>
        ):(
          <>
            <RichTextEditor value={content} onChange={setContent} />
            <button
              className="btn btn-primary mt-3"
              onClick={SubmitAboutUsForm}
            >
              Submit
            </button>
          </>
        )}


        <h2 className="text-center py-4">Our Products</h2>
        <div className="row">
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src="https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">Mens's Clothing</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src="https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">Women's Clothing</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src="https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">Jewelery</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">Electronics</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AboutPage