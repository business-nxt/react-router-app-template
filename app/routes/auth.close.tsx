export async function clientLoader() {
  window.close();
  return {
    success: true,
  };
}

clientLoader.hydrate = true;

export default function Close() {
  return (
    <div className="">
      <h1>Closing window...</h1>
    </div>
  );
}
