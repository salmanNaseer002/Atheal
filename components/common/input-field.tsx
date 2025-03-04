import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldValues, useFormContext } from "react-hook-form";
import { Path, PathValue } from "react-hook-form";
import { SelectOptions } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { INPUT_TYPES } from "@/enums";

export const capitalizeText = (text: string) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

type InputFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>;
  type?: string;
  rows?: number;
  disabled?: boolean;
  label?: string;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  selectOptions?: SelectOptions[];
  showIsRequired?: boolean;
};

export const InputField = <TFieldValues extends FieldValues = FieldValues>({
  name,
  defaultValue,
  type = INPUT_TYPES.TEXT,
  disabled,
  label,
  placeholder,
  selectOptions,
  className,
  multiline = false,
  showIsRequired = false,
}: InputFieldProps<TFieldValues>) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        if (type === INPUT_TYPES.CHECKBOX) {
          return (
            <FormItem className={className}>
              <div className="flex items-center">
                <FormLabel className="mr-2">
                  {label}
                  {showIsRequired && (
                    <span className="text-red-500">{` * `}</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={defaultValue}
                    type={type}
                    className="w-4 h-4 rounded-sm"
                    disabled={disabled}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          );
        } else if (type === INPUT_TYPES.SELECT) {
          return (
            <FormItem className={className}>
              <FormLabel>
                {label}
                {showIsRequired && (
                  <span className="text-red-500">{` * `}</span>
                )}
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={capitalizeText(placeholder || "")}
                    />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {selectOptions?.map(({ value, label }) => (
                    <SelectItem key={value} value={value.toString()}>
                      {capitalizeText(label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          );
        } else if (multiline) {
          return (
            <FormItem className={className}>
              <FormLabel>
                {label}
                {showIsRequired && (
                  <span className="text-red-500">{` * `}</span>
                )}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  placeholder={placeholder}
                  defaultValue={defaultValue}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        } else if (defaultValue && INPUT_TYPES.TEXT) {
          const { name, onBlur, onChange, ref, disabled } = field;
          const fields = { name, onBlur, onChange, ref, disabled };
          return (
            <FormItem className={className}>
              <FormLabel>
                {label}
                {showIsRequired && (
                  <span className="text-red-500">{` * `}</span>
                )}
              </FormLabel>
              <FormControl>
                <Input
                  {...fields}
                  placeholder={placeholder}
                  type={type}
                  defaultValue={defaultValue}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        } else
          return (
            <FormItem className={className}>
              <FormLabel className="">
                {label}
                {showIsRequired && (
                  <span className="text-red-500">{` * `}</span>
                )}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={placeholder}
                  type={type}
                  defaultValue={defaultValue}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
      }}
    />
  );
};
