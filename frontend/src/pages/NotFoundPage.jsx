import Card from '../components/common/Card';

/**
 * Placeholder — next in the build queue. Not a dead route: it renders a
 * real, styled page so navigation/layout can be reviewed today.
 */
const Page = () => (
  <div className="container" style={{ padding: '80px 0' }}>
    <Card>
      <h1 style={{ marginBottom: 8 }}>Page Not Found</h1>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        This screen is next up in the build.
      </p>
    </Card>
  </div>
);

export default Page;
