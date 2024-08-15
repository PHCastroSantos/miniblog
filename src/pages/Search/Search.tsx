import styles from './Search.module.css'
import { useFetchDocuments } from '../../hooks/useFetchDocuments'
import { useQuery } from '../../hooks/useQuery'
import PostDetail from '../../components/PostDetail'
import { Link } from 'react-router-dom'

interface Post {
  id: string,
  title: string,
  image: string,
  createdBy: string,
  tagsArray: string[]
}

const Search = () => {
    const query = useQuery()
    const search = query.get("q")

    const {documents} = useFetchDocuments("posts", search)

    const posts: Post[] = documents?.map(doc => ({
      id: doc.id,
      title: doc.title,
      image: doc.image,
      createdBy: doc.createdBy,
      tagsArray: doc.tagsArray
    })) || []

  return (
    <div className={styles.search_container}>
        <h2>Search</h2>
        <div>
            {posts && posts.length === 0 && (
                <div className={styles.noposts}>
                <p>Não foram encontrados posts a partir da sua busca...</p>
                <Link to="/" className="btn btn-dark">Voltar</Link>
                </div>
            )}
            {posts && posts.map((post) => (<PostDetail key={post.id} post={post}/>))}
        </div>
    </div>
  )
}

export default Search