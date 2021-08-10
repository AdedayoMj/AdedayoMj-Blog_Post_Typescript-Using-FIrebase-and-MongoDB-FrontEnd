import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';
import Header from '../components/header';
import BlogPreview from '../components/blog_preview';
import ErrorText from '../components/error_text';
import LoadingComponent from '../components/loading_components';
import config from '../config/config';
import IBlog from '../interfaces/blog';
// import Naviagtion from '../components/navigation';
import IPageProps from '../interfaces/pages';

import IUser from '../interfaces/user';

const HomePage: React.FunctionComponent<IPageProps> = (props) => {
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        getAllBlogs();
    }, []);


    const getAllBlogs = async () => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${config.server.url}/blogs`
            });

            if (response.status === (200 || 304)) {
                let blogs = response.data.blogs as IBlog[];
                blogs.sort((x, y) => y.updatedAt.localeCompare(x.updatedAt));

                setBlogs(blogs);
            } else {
                setError('Unable to retrieve blogs');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    };

    if (loading)
    {
        return <LoadingComponent>Loading blogs...</LoadingComponent>
    }
    return (
        <Container fluid className="p-0">
            {/* <Naviagtion/> */}
            <Header title="Blog" headline="checkout my test blog using typescript" />

            <Container  className="mt-5">
                {blogs.length === 0 && (
                    <p>
                        There are no blogs yet. You should <Link to="/edit">post</Link> one 😊.
                    </p>
                )}
                {blogs.map((blog, index) => {
                    return (
                        <div key={index}>
                            <BlogPreview _id={blog._id} author={(blog.author as IUser).name} headline={blog.headline} title={blog.title} createdAt={blog.createdAt} updatedAt={blog.updatedAt} />
                            <hr color="white"  />
                        </div>
                    );
                })}
                <ErrorText error={error} />
            </Container>
        </Container>
    );
};

export default HomePage;
