# FormSheet компоненты

## Обзор

FormSheet - это переиспользуемый компонент для создания модальных окон с формами редактирования данных. Он основан на `EditSheet` и интегрируется с Zod для валидации.

## Компоненты

### FormSheet

Основной компонент, который оборачивает контент в Sheet и предоставляет контекст для формы.

**Props:**

```tsx
interface FormSheetProps<T extends ZodTypeAny> {
  trigger: ReactNode         // Триггер открытия (кнопка, иконка и т.д.)
  title: string              // Заголовок окна
  description?: string       // Описание окна
  schema: T                  // Zod схема валидации
  defaultValues?: Partial<z.infer<T>>  // Начальные значения полей
  onSubmit: (values: z.infer<T>) => Promise<void> | void  // Обработчик сохранения
  isOpen?: boolean           // Управление открытием (опционально)
  onOpenChange?: (open: boolean) => void  // Обратный вызов при изменении состояния
  side?: "top" | "right" | "bottom" | "left"  // Позиция Sheet
  showCloseButton?: boolean  // Показывать кнопку закрытия
  children: ReactNode        // Контент формы
}
```

### FormSheetField

Компонент для создания полей формы с автоматической регистрацией и валидацией.

**Props:**

```tsx
interface FormSheetFieldProps<T extends ZodTypeAny = ZodTypeAny> {
  name: string          // Имя поля (должно совпадать с ключом в схеме)
  label?: string        // Лейбл поля
  description?: string  // Описание поля
  schema: T             // Zod схема для валидации этого поля
  children?: (props: {
    value: any          // Текущее значение
    onChange: (value: any) => void  // Функция для изменения значения
    error?: string      // Ошибка валидации (если есть)
  }) => ReactNode       // Рендер функция для кастомного содержимого
}
```

### useFormSheet

Хук для доступа к контексту формы. Используется для создания кастомных полей.

## Установка

Компоненты уже доступны в `@workspace/ui`:

```tsx
import { FormSheet, FormSheetField } from "@workspace/ui/components/form-sheet"
import { z } from "zod"
```

## Примеры использования

### Базовый пример

```tsx
import { FormSheet, FormSheetField } from "@workspace/ui/components/form-sheet"
import { z } from "zod"
import { Input } from "@workspace/ui/components/input"

const userSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Некорректный email"),
  role: z.string().min(1, "Выберите роль"),
})

export function EditUser({ user, onSave }) {
  return (
    <FormSheet
      trigger={<Button>Редактировать пользователя</Button>}
      title="Редактирование пользователя"
      schema={userSchema}
      defaultValues={{
        name: user.name,
        email: user.email,
        role: user.role,
      }}
      onSubmit={async (values) => {
        await onSave(values)
      }}
    >
      <FormSheetField name="name" label="Имя" schema={userSchema.shape.name}>
        {({ value, onChange, error }) => (
          <>
            <Input value={value} onChange={onChange} />
            {error && <span className="text-destructive text-sm">{error}</span>}
          </>
        )}
      </FormSheetField>
      
      <FormSheetField name="email" label="Email" schema={userSchema.shape.email}>
        {({ value, onChange, error }) => (
          <Input type="email" value={value} onChange={onChange} />
        )}
      </FormSheetField>
      
      <FormSheetField name="role" label="Роль" schema={userSchema.shape.role}>
        {({ value, onChange, error }) => (
          <select value={value} onChange={onChange}>
            <option value="user">Пользователь</option>
            <option value="admin">Администратор</option>
          </select>
        )}
      </FormSheetField>
    </FormSheet>
  )
}
```

### С кастомными компонентами

```tsx
import { FormSheet, FormSheetField } from "@workspace/ui/components/form-sheet"
import { z } from "zod"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@workspace/ui/components/select"

const productSchema = z.object({
  name: z.string().min(3, "Название должно содержать минимум 3 символа"),
  price: z.number().positive("Цена должна быть положительной"),
  category: z.string().min(1, "Выберите категорию"),
})

export function EditProduct({ product, onSave }) {
  return (
    <FormSheet
      trigger={<Button>Редактировать товар</Button>}
      title="Редактирование товара"
      schema={productSchema}
      defaultValues={{
        name: product.name,
        price: product.price,
        category: product.category,
      }}
      onSubmit={async (values) => {
        await onSave(values)
      }}
    >
      <FormSheetField name="name" label="Название" schema={productSchema.shape.name}>
        {({ value, onChange, error }) => (
          <Input value={value} onChange={onChange} />
        )}
      </FormSheetField>
      
      <FormSheetField name="price" label="Цена" schema={productSchema.shape.price}>
        {({ value, onChange, error }) => (
          <Input 
            type="number" 
            value={value} 
            onChange={(e) => onChange(Number(e.target.value))} 
          />
        )}
      </FormSheetField>
      
      <FormSheetField name="category" label="Категория" schema={productSchema.shape.category}>
        {({ value, onChange, error }) => (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electronics">Электроника</SelectItem>
              <SelectItem value="clothing">Одежда</SelectItem>
              <SelectItem value="food">Еда</SelectItem>
            </SelectContent>
          </Select>
        )}
      </FormSheetField>
    </FormSheet>
  )
}
```

### С вложенной формой

```tsx
import { FormSheet, FormSheetField } from "@workspace/ui/components/form-sheet"
import { z } from "zod"
import { Input } from "@workspace/ui/components/input"

const addressSchema = z.object({
  street: z.string().min(1, "Улица обязательна"),
  city: z.string().min(1, "Город обязательна"),
  zip: z.string().min(5, "Почтовый индекс должен содержать минимум 5 символов"),
})

const customerSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Некорректный email"),
  address: addressSchema,
})

export function EditCustomer({ customer, onSave }) {
  return (
    <FormSheet
      trigger={<Button>Редактировать клиента</Button>}
      title="Редактирование клиента"
      schema={customerSchema}
      defaultValues={{
        name: customer.name,
        email: customer.email,
        address: customer.address,
      }}
      onSubmit={async (values) => {
        await onSave(values)
      }}
    >
      <FormSheetField name="name" label="Имя" schema={customerSchema.shape.name}>
        {({ value, onChange, error }) => (
          <Input value={value} onChange={onChange} />
        )}
      </FormSheetField>
      
      <FormSheetField name="email" label="Email" schema={customerSchema.shape.email}>
        {({ value, onChange, error }) => (
          <Input type="email" value={value} onChange={onChange} />
        )}
      </FormSheetField>
      
      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-2">Адрес</h3>
        <FormSheetField name="address.street" label="Улица" schema={addressSchema.shape.street}>
          {({ value, onChange, error }) => (
            <Input value={value} onChange={onChange} />
          )}
        </FormSheetField>
        
        <FormSheetField name="address.city" label="Город" schema={addressSchema.shape.city}>
          {({ value, onChange, error }) => (
            <Input value={value} onChange={onChange} />
          )}
        </FormSheetField>
        
        <FormSheetField name="address.zip" label="Почтовый индекс" schema={addressSchema.shape.zip}>
          {({ value, onChange, error }) => (
            <Input value={value} onChange={onChange} />
          )}
        </FormSheetField>
      </div>
    </FormSheet>
  )
}
```

## Advanced usage

### Создание кастомного поля

```tsx
import { useFormSheet } from "@workspace/ui/components/form-sheet"

function CustomCheckboxField({ name, label }: { name: string; label: string }) {
  const { getValue, setValue, errors, isLoading } = useFormSheet()
  
  const value = getValue(name) || false
  const error = errors[name]

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => setValue(name, e.target.checked)}
        disabled={isLoading}
      />
      <label>{label}</label>
      {error && <span className="text-destructive text-sm">{error}</span>}
    </div>
  )
}
```

## Связанные компоненты

- `EditSheet` - улучшенная версия Sheet с поддержкой `isLoading` и асинхронного сохранения
- `Field`, `FieldLabel`, `FieldDescription`, `FieldError` - компоненты для структурирования формы
- `Input`, `Label` - базовые инпуты

## Паттерны

### Управление состоянием открытия

```tsx
export function EditUser() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Редактировать</Button>
      <FormSheet
        trigger={<span />} // Пустой триггер, управляем через state
        title="Редактирование"
        schema={userSchema}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={onSave}
      >
        {/* поля формы */}
      </FormSheet>
    </>
  )
}
```

### Валидация при изменении

По умолчанию валидация происходит при нажатии кнопки "Сохранить". Для валидации при изменении полей, можно добавить `onChange` обработчик с валидацией.

### Обработка ошибок

```tsx
<FormSheet
  trigger={<Button>Редактировать</Button>}
  title="Редактирование"
  schema={userSchema}
  defaultValues={defaultValues}
  onSubmit={async (values) => {
    try {
      await api.updateUser(values)
      // Успешное сохранение
    } catch (error) {
      // Обработка ошибки сервера
      throw error // Ошибка будет отображена в UI
    }
  }}
>
  {/* поля */}
</FormSheet>
```

## Типизация

Компоненты полностью типизированы с использованием Zod схем:

```tsx
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

// Тип для значений формы
type UserFormValues = z.infer<typeof userSchema>

// Тип для отдельного поля
type NameField = z.infer<typeof userSchema.shape.name>
```
