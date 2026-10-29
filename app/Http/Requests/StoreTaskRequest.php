<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('status') && is_string($this->status)) {
            $this->merge([
                'status' => strtolower(str_replace(' ', '_', trim($this->status))),
            ]);
        }
        if ($this->has('priority') && is_string($this->priority)) {
            $this->merge([
                'priority' => strtolower(trim($this->priority)),
            ]);
        }
    }

    public function rules(): array
    {
        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'status' => 'required|in:pending,in_progress,completed',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
        ];

        if ($this->user() && $this->user()->isAdmin()) {
            $rules['assigned_to'] = 'nullable|exists:users,id';
        } else {
            $rules['assigned_to'] = [
                'nullable',
                function ($attribute, $value, $fail) {
                    if (!empty($value) && (int) $value !== (int) $this->user()->id) {
                        $fail('Employees are not permitted to assign tasks to others.');
                    }
                },
            ];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'title.required' => 'The title field is required.',
            'due_date.date' => 'The due date field must be a valid date.',
        ];
    }
}
