"use client"

export default function EmployeesPage() {
  return (
    <div>
      <h1 className={"m-auto flex items-center justify-start font-light"}>
        Здесь будет страница с сотрудниками
      </h1>
      {/* Генерация 50 div'ов */}
      {[...Array(50)].map((_, index) => (
        <div key={index} className="my-2 border p-4">
          Сотрудник {index + 1}
        </div>
      ))}
    </div>
  )
}
