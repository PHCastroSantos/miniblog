import styles from './EditPost.module.css'

import { useState, FormEvent, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthValue } from '../../context/AuthContext'
import { useFetchDocument } from '../../hooks/useFetchDocument'
import { useUpdateDocument } from '../../hooks/useUpdateDocument'

const EditPost = () => {

    const {id} = useParams()
    const {document: post} = useFetchDocument("posts", id || "")

  const [title, setTitle] = useState<string>("")
  const [image, setImage] = useState<string>("")
  const [body, setBody] = useState<string>("")
  const [tags, setTags] = useState<string>("")
  const [formError, setFormError] = useState<string>("")

  useEffect(() => {
    if(post) {
        setTitle(post.title || "" )
        setBody(post.body || "")
        setImage(post.image || "")

        const textTags = post.tagsArray.join(", ")
        setTags(textTags)
    }
  }, [post])

  const {user} = useAuthValue()

  const {updateDocument, response} = useUpdateDocument("posts")

  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setFormError("")

    try {
      new URL(image)
    } catch(error) {
      setFormError("A imagem precisa ser uma URL.")
      return
    }

    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase())

    if(!title || !image || !tags || !body) {
      setFormError("Por favor, preencha todos os campos!")
      return
    }

    const data = {
    title,
      image,
      body,
      tags: tagsArray,
      uid: user?.uid,
      createdBy: user?.displayName
    }

    if (id) {
      updateDocument(id, data)
      navigate("/dashboard")
    } else {
      setFormError("O ID do post é inválido.")
    }
  }

  return (
    <div className={styles.edit_post}>

        {post? (
            <>
            <h2>Editando post: {post.title}</h2>
      <p>Altere os dados do post como desejar.</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Título:</span>
          <input type="text" name='title' required placeholder='Pense num bom título...' onChange={(e) => setTitle(e.target.value)} value={title}/>
        </label>

        <label>
          <span>URL da imagem:</span>
          <input type="text" name='image' required placeholder='Insira uma imagem que representa o seu post' onChange={(e) => setImage(e.target.value)} value={image}/>
        </label>

            <p className={styles.preview_title}>Previw da imagem atual: </p>
            <img src={post.image} alt={post.title} className="styles image_previw" />

        <label>
          <span>Conteúdo:</span>
          <textarea name='body' required placeholder='Insira o conteúdo do post' onChange={(e) => setBody(e.target.value)} value={body}/>
        </label>

        <label>
          <span>Tags:</span>
          <input type="text" name='tags' required placeholder='Insira as tags separadas por vírgula' onChange={(e) => setTags(e.target.value)} value={tags}/>
        </label>
        {!response.loading && <button className='btn'>Editar</button>}
        {response.loading && (<button className='btn' disabled>Aguarde...</button>)}
        {response.error && <p className='error'>{response.error}</p>}
        {formError && <p className='error'>{formError}</p>}
      </form>
            </>

        ): (null)}

    </div>
  )
}

export default EditPost