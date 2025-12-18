import { NextPageContext } from 'next'

interface ErrorProps {
    statusCode: number | undefined
}

// Custom error page that doesn't use any React context
// This is required because Next.js statically exports the 500 page
// and context providers aren't available during static generation
function Error({ statusCode }: ErrorProps) {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#09090b',
            color: 'white',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h1 style={{
                    fontSize: '4rem',
                    fontWeight: 'bold',
                    margin: '0 0 1rem 0',
                    color: '#fafafa'
                }}>
                    {statusCode || 'Error'}
                </h1>
                <p style={{
                    fontSize: '1.125rem',
                    color: '#a1a1aa',
                    margin: '0 0 2rem 0'
                }}>
                    {statusCode === 404
                        ? 'This page could not be found.'
                        : statusCode === 500
                            ? 'An internal server error occurred.'
                            : 'An unexpected error occurred.'}
                </p>
                <a
                    href="/"
                    style={{
                        display: 'inline-block',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#4f46e5',
                        color: 'white',
                        borderRadius: '0.375rem',
                        textDecoration: 'none',
                        fontWeight: '500'
                    }}
                >
                    Go Home
                </a>
            </div>
        </div>
    )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error
