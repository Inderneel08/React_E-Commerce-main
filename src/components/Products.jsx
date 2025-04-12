import React, { useState, useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const Products = () => {
  // const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories,setCategories] = useState([]);

  const { isAuthenticated } = useSelector((state) => state.auth);

  let componentMounted = true;

  const dispatch = useDispatch();

  const addToCart = async (product) => {
    try {
      const response = await axios.post("http://localhost/laravel-backend/api/auth/addToCart",product,{
        withCredentials: true
      })

    } catch (error) {
      console.error();
    }
  }

  const addProduct = (product) => {

    if(isAuthenticated){
      addToCart(product);
    }
    else{
      dispatch(addCart(product));
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("http://localhost/laravel-backend/api/products");
      if (componentMounted) {
        const result = await response.json();  // Parse the response once
        // setData(result.products);
        setFilter(result.products);
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    };

    const getCategories = async () => {
      setLoading(true);

      const response = await fetch("http://localhost/laravel-backend/api/getAll/categories");

      if (componentMounted) {
        const result = await response.json();  // Parse the response once
        setCategories(result.categories);
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    }

    getProducts();

    getCategories();

  }, []);

  const fetchAllProducts = async () =>{
    setLoading(true);

    const response = await fetch("http://localhost/laravel-backend/api/products");

    if (componentMounted) {
      const result = await response.json();  // Parse the response once
      // setData(result.products);
      setFilter(result.products);
      setLoading(false);
    }
  }

  const fetchProductsOnCategory = (category_id) => async () => {
    const response2 = await fetch(`http://localhost/laravel-backend/api/products/category/${category_id}`
    );

    const data2 = await response2.json();

    setFilter(data2.productInfoCategory);
  }


  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  // const filterProduct = (cat) => {
  //   const updatedList = data.filter((item) => item.category === cat);
  //   setFilter(updatedList);
  // };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          {categories.map(category => {
            if(category.category_name === "all"){
              return(
                <button key={category.id}  className="btn btn-outline-dark btn-sm m-2" onClick={fetchAllProducts} >
                  { category.title_name }
                </button>
              );
            }
            else{
              return(
                <button key={category.id}  className="btn btn-outline-dark btn-sm m-2" onClick={fetchProductsOnCategory(category.id)} >
                  { category.title_name }
                </button>
              );
            }
          })}
        </div>


        {/* <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => fetchAllProducts()}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>
        </div> */}

        {filter.map((product) => {
          return (
            <div
              id={product.id}
              key={product.id}
              className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
            >
              <div className="card text-center h-100" key={product.id}>
                <img
                  className="card-img-top p-3"
                  src={product.image}
                  alt="Card"
                  height={300}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {product.title.substring(0, 12)}...
                  </h5>
                  <p className="card-text">
                    {product.description.substring(0, 90)}...
                  </p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item lead">$ {product.price}</li>
                  {/* <li className="list-group-item">Dapibus ac facilisis in</li>
                    <li className="list-group-item">Vestibulum at eros</li> */}
                </ul>
                <div className="card-body">
                  <Link
                    to={"/product/" + product.id}
                    className="btn btn-dark m-1"
                  >
                    Buy Now
                  </Link>
                  <button
                    className="btn btn-dark m-1"
                    onClick={() => {
                      toast.success("Added to cart");
                      addProduct(product);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
