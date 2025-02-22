import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./../../styles/upcoming.css";
import TestCard from './TestCard';




function ExpiredTest() {
  const location = useLocation();
  const { userid } = location.state || {}; // Get user ID from location state
  const navigate = useNavigate();




  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();




  // Function to fetch tests with pagination
  const fetchTests = async (pageNum) => {
    try {
      const response = await fetch(`/api/Showing_test_to_student/${userid}?page=${pageNum}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tests');
      }
      const data = await response.json();
      if (data.length === 0) setHasMore(false);
      setTests(prevTests => [...prevTests, ...data.tests]);
      setHasMore(data.has_more);
    } catch (err) {
     
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    if (userid) {
      fetchTests(page);
    }
  }, [userid, page]);




  // Observer to trigger loading more tests
  const lastTestRef = useCallback(node => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);




  if (loading && tests.length === 0) {
    return <div>Loading...</div>;
  }




  if (error) {
    return <div>Error: {error}</div>;
  }




  return (
    <div className='main-page'>
      <header className='head'>Welcome Student</header>
      <div className='upcoming-t' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {tests.map((test, index) => {
          if (index === tests.length - 1) {
            return <TestCard ref={lastTestRef} key={test.id} test={test} type="expire" />;
          }
          return <TestCard key={test.id} test={test} type="expire"/>;
        })}
      </div>
    </div>
  );
}




export default ExpiredTest;






