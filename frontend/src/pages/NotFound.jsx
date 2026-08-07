import { Link } from 'react-router-dom';
import Container from '../components/Container';
import Section from '../components/Section';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <Section className="flex items-center justify-center min-h-[60vh]">
      <Container>
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link to="/">
            <Button variant="primary">Go Back Home</Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
