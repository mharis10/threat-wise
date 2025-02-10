import { AppLayout } from 'components/app/layout'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

export const Blog = () => {
	const [blogPosts, setBlogPosts] = useState([])
	const { id } = useParams() // Retrieve the ID from the URL
	const navigate = useNavigate() // Used for navigating

	useEffect(() => {
		const loadPosts = async () => {
			const postFiles = ['post1', 'post2'] // Assuming post1.js and post2.js are your blog post files
			const postsPromises = postFiles.map(
				file => import(`../blogPosts/${file}.js`) // Ensure the path is correct relative to this file
			)
			const postsModules = await Promise.all(postsPromises)
			const posts = postsModules.map(module => module.default)
			setBlogPosts(posts.sort((a, b) => new Date(b.date) - new Date(a.date)))
		}

		loadPosts()
	}, [])

	// Function to render the detailed view of a post
	const renderPostDetail = post => (
		<div>
			<h2 className="text-4xl font-bold text-darkBlue mb-8">{post.title}</h2>
			<img src={post.image} alt={post.title} style={{ maxWidth: '100%', borderRadius: '8px' }} />
			<p className="text-gray-600 my-4">{post.detailedContent}</p>
			<time className="text-gray-500 text-sm">{new Date(post.date).toLocaleDateString()}</time>
			<button onClick={() => navigate('/blog')} className="mt-4 text-primaryRed">
				Back to Blog
			</button>
		</div>
	)

	// Check if an ID is present and render the specific post
	const postDetail = blogPosts.find(post => post.id.toString() === id)

	return (
		<AppLayout>
			<div className="py-12 sm:py-16 bg-white">
				<div className="mx-auto max-w-4xl px-4 lg:px-8">
					{id && postDetail ? (
						renderPostDetail(postDetail)
					) : (
						<div>
							<h1 className="text-4xl font-bold text-darkBlue mb-8">Our Blog</h1>
							<div className="space-y-8">
								{blogPosts.map(post => (
									<article
										key={post.id}
										className="p-6 rounded-lg border border-gray-200 shadow-sm">
										<h2 className="text-2xl font-semibold text-primaryRed mb-2">{post.title}</h2>
										<p className="text-gray-700 mb-4">{post.headline}</p>
										<Link
											to={`/blog/${post.id}`}
											className="text-white bg-primaryRed hover:bg-red-700 transition duration-150 ease-in-out px-4 py-2 rounded">
											Read More
										</Link>
									</article>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</AppLayout>
	)
}

export default Blog
