import { fetchData } from '@/utils/dataResource';

export function DataContent() {
  const data = fetchData();

  return (
    <div>
      <h1>All CO2 Emissions Data </h1>
      {data.data &&
        Object.keys(data.data).map(key => (
          <div key={key} className="data-item">
            <strong>{key}:</strong>
          </div>
        ))}
    </div>
  );
}
