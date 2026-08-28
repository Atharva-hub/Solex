import { Link } from 'react-router-dom'

const Footer = () => {
	return (
		<footer className="bg-dark text-light">
			<div className="container py-5">
				<div className="row g-4">
					<div className="col-lg-5">
						<Link className="h4 text-white text-decoration-none fw-bold text-uppercase" to="/">
							Solex
						</Link>
						<p className="text-secondary mt-3 mb-0">
							Curated footwear for every pace, place, and personal style.
						</p>
					</div>

					<div className="col-6 col-lg-3">
						<h2 className="h6 text-uppercase fw-bold">Explore</h2>
						<ul className="list-unstyled mb-0">
							<li className="mb-2"><Link className="link-light text-decoration-none" to="/">Home</Link></li>
							<li className="mb-2"><Link className="link-light text-decoration-none" to="/shoes">Shop all shoes</Link></li>
							<li><Link className="link-light text-decoration-none" to="/wishlist">Wishlist</Link></li>
						</ul>
					</div>

					<div className="col-6 col-lg-3">
						<h2 className="h6 text-uppercase fw-bold">Account</h2>
						<ul className="list-unstyled mb-0">
							<li className="mb-2"><Link className="link-light text-decoration-none" to="/login">Sign in</Link></li>
							<li><Link className="link-light text-decoration-none" to="/cart">View cart</Link></li>
						</ul>
					</div>
				</div>
			</div>
			<div className="border-top border-secondary">
				<div className="container py-3 small text-secondary">
					© {new Date().getFullYear()} Solex. All rights reserved.
				</div>
			</div>
		</footer>
	)
}

export default Footer
