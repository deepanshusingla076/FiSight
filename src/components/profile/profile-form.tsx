'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useProfile,
  isProfileComplete,
  ASSET_FIELDS,
  DEBT_FIELDS,
  type UserProfile,
} from '@/hooks/use-profile';
import { parseOptionalNumber } from '@/lib/user-profile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Save, ArrowRight, Loader2 } from 'lucide-react';

const requiredAmount = z.coerce.number().positive();
const optionalAmount = z.preprocess(
  (val) => parseOptionalNumber(val),
  z.number().min(0).nullable()
);

const profileSchema = z.object({
  annualIncome: requiredAmount,
  monthlyExpenses: requiredAmount,
  age: z.coerce.number().min(18).max(100),
  creditScore: z.coerce.number().min(300).max(850),
  employmentYears: z.coerce.number().min(0).max(50),
  dependents: z.coerce.number().min(0).max(10),
  cashSavings: optionalAmount,
  investments: optionalAmount,
  retirementBalance: optionalAmount,
  propertyValue: optionalAmount,
  otherAssets: optionalAmount,
  creditCardDebt: optionalAmount,
  studentLoans: optionalAmount,
  mortgage: optionalAmount,
  carLoan: optionalAmount,
  otherDebt: optionalAmount,
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type ProfileFormProps = {
  onboarding?: boolean;
};

function NullableMoneyInput({
  value,
  onChange,
  placeholder = 'Leave empty if none',
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  placeholder?: string;
}) {
  return (
    <Input
      type="number"
      min={0}
      step="any"
      placeholder={placeholder}
      value={value ?? ''}
      onChange={(e) => {
        const raw = e.target.value;
        onChange(raw === '' ? null : Number(raw));
      }}
    />
  );
}

export function ProfileForm({ onboarding = false }: ProfileFormProps) {
  const { profile, setProfile, profileSaving } = useProfile();
  const { toast } = useToast();
  const router = useRouter();
  const { clearNewUserFlag } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });

  useEffect(() => {
    form.reset(profile);
  }, [profile, form]);

  function onSubmit(values: ProfileFormValues) {
    const next = values as UserProfile;
    setProfile(next);
    clearNewUserFlag();

    if (onboarding && isProfileComplete(next)) {
      toast({
        title: 'Profile saved',
        description: 'Your data is stored securely. Opening dashboard…',
      });
      router.replace('/dashboard?tour=true');
      return;
    }

    toast({
      title: profileSaving ? 'Saving…' : 'Profile saved',
      description: 'Synced to your account (browser + cloud).',
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">
          {onboarding ? 'Step 1 — Your financial profile' : 'Your financial profile'}
        </CardTitle>
        <CardDescription>
          Enter numbers only. Leave a field empty if it does not apply — we store it as null, not fake data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Income & household</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="annualIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual income ($) *</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="monthlyExpenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly expenses ($) *</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="creditScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit score</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentYears"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years employed</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dependents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dependents</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Assets</h3>
                <FormDescription className="text-xs">
                  At least one asset amount is required. Empty = you do not have that category.
                </FormDescription>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {ASSET_FIELDS.map(({ key, label }) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <NullableMoneyInput
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Debt</h3>
                <FormDescription className="text-xs">
                  Optional — leave blank (null) if you have no debt in that category.
                </FormDescription>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {DEBT_FIELDS.map(({ key, label }) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <NullableMoneyInput
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </section>

            <Button type="submit" className="w-full sm:w-auto" disabled={profileSaving}>
              {profileSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : onboarding ? (
                <>
                  Continue to dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save profile
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
