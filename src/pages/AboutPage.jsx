import React, { useEffect,useState  } from 'react'
import { Footer, Navbar } from "../components";
import { useSelector } from 'react-redux'
import { RichTextEditor } from '@mantine/rte';
import axios from "axios";
const AboutPage = () => {

  const { role_user } = useSelector((state) => state.auth);

  const [content, setContent] = useState('');

  const SubmitAboutUsForm = async(e) => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/updateAboutUs", content ,{
        withCredentials: true
      });
    } catch (error) {
      console.error();
    }
  };

  useEffect(() => {

    const fetchAboutUs = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/auth/getAboutUs");

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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
            facere doloremque veritatis odit similique sequi. Odit amet fuga nam
            quam quasi facilis sed doloremque saepe sint perspiciatis explicabo
            totam vero quas provident ipsam, veritatis nostrum velit quos
            recusandae est mollitia esse fugit dolore laudantium. Ex vel explicabo
            earum unde eligendi autem praesentium, doloremque distinctio nesciunt
            porro tempore quis eaque labore voluptatibus ea necessitatibus
            exercitationem tempora molestias. Ad consequuntur veniam sequi ullam
            tempore vel tenetur soluta dolore sunt maxime aliquam corporis est,
            quo saepe dolorem optio minus sint nemo totam dolorum! Reprehenderit
            delectus expedita a alias nam recusandae illo debitis repellat libero,
            quasi explicabo molestiae saepe, dolorem tempore itaque eveniet quam
            dignissimos blanditiis excepturi harum numquam vel nihil? Ipsum
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