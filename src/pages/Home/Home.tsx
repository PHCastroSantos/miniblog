// CSS
import styles from './Home.module.css'

// Hooks
import { useNavigate, Link } from 'react-router-dom'
import { useState, FormEvent } from 'react'
import { useFetchDocuments } from '../../hooks/useFetchDocuments'
import PostDetail from '../../components/PostDetail'

// Components

interface Post {
  id: string;
  title: string;
  image: string;
  createdBy: string;
  tagsArray: string[];
}

const Home = () => {

  const [query, setQuery] = useState<string>("")
  const {documents: posts, loading} = useFetchDocuments<Post>("posts")

  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if(query) {
      return navigate(`/search?q=${query}`)
    }
  }

  return (
    <div className={styles.home}>
        <h1>Veja os nossos posts mais recentes</h1>
        <form onSubmit={handleSubmit} className={styles.search_form}>
          <input type="text" placeholder='Ou busque por tags...' onChange={(e) => setQuery(e.target.value)} value={query}/>
          <button className="btn btn-dark">Pesquisar</button>
        </form>

        <div>
          {loading && <p>Carregando...</p>}
          {posts && posts.length > 0 && posts.map((post) => <PostDetail key={post.id} post={post}/>)}
          {posts && posts.length === 0 && (
            <div className={styles.noposts}>
              <p>Não foram encontrados posts</p>
              <Link to="/posts/create" className='btn'>Criar primeiro post</Link>
            </div>
          )}

    
        </div>

    </div>
  )
}

export default Home