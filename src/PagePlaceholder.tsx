/** Temporary page body until each section is built out. */
export function PagePlaceholder({ title }: { title: string }) {
  return (
    <div className="page-header">
      <div className="page-header-div"><h1>{title}</h1></div>
    </div>
  )
}
