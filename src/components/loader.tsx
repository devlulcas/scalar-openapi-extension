import css from './loader.module.css';

export function Loader() {
  return (
    <div className={css.loading}>
      <div className={css.spinner} />
      <span>Checking for OpenAPI spec...</span>
    </div>
  );
}
