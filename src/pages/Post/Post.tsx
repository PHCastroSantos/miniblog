import styles from './Post.module.css'

//hooks
import { useParams } from 'react-router-dom'
import { useFetchDocument } from '../../hooks/useFetchDocument'

interface Post {
    id: string;
    title: string;
    image: string;
    body: string;
    tagsArray: string[];
  }

const Post = () => {

    const {id} = useParams()

    const { document: post } = id ? useFetchDocument("posts", id) : { document: null };


  return (
    <div className={styles.post_container}>
        {post && (
            <>
            <h1>{post.title}</h1>
            <img src={post.image} alt={post.title} />
            <p>{post.body}</p>
            <h3>Este post trata sobre:</h3>
            <div className={styles.tags}>
            {post.tagsArray.map((tag: string) => 
            <p key={tag}><span>#</span>{tag}</p>
            )}
            </div>
            </>)
        }
    </div>
  )
}

export default Post