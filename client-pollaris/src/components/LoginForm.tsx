import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface LoginFormProps {
  email: string
  setemail: (val: string) => void
  password: string
  setpassword: (val: string) => void
  login: () => void
  toggleMode: () => void
}

export function LoginForm({ email, setemail, password, setpassword, login, toggleMode }: LoginFormProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Login</CardTitle>
        <CardAction>
          <Button variant="link" className="text-chart-1" onClick={toggleMode}>
            Register
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FieldSet className="w-full">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" value={email} type="email" placeholder="krrish@leafvillage.com" onChange={(e) => { setemail(e.target.value) }} />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" value={password} type="password" placeholder="password" onChange={(e) => { setpassword(e.target.value) }} />
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={login}>
          Login
        </Button>
      </CardFooter>
    </Card>
  )
}