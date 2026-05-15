import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface RegisterFormProps {
  username: string
  setusername: (val: string) => void
  email: string
  setemail: (val: string) => void
  password: string
  setpassword: (val: string) => void
  register: () => void
  toggleMode: () => void
}

export function RegisterForm({ username, setusername, email, setemail, password, setpassword, register, toggleMode }: RegisterFormProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Register</CardTitle>
        <CardAction>
          <Button variant="link" className="text-chart-1" onClick={toggleMode}>
            Login
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FieldSet className="w-full">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input id="username" value={username} type="text" placeholder="krrish" onChange={(e) => { setusername(e.target.value) }} />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" value={email} type="email" placeholder="krrish@leafvillage.com" onChange={(e) => { setemail(e.target.value) }} />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
              <Input id="password" value={password} type="password" placeholder="password" onChange={(e) => { setpassword(e.target.value) }} />
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={register}>
          Register
        </Button>
      </CardFooter>
    </Card>
  )
}