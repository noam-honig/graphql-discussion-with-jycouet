<script lang="ts">
  import { Button } from '$components/ui/button'
  import { Checkbox } from '$components/ui/checkbox'
  import Input from '$components/ui/input/Input.svelte'
  import Label from '$components/ui/label/Label.svelte'
  import { filter } from 'graphql-yoga'
  import type { FieldMetadata, Repository } from 'remult'
  import { createEventDispatcher } from 'svelte'
  import { writable } from 'svelte/store'

  export let repo: Repository<any>
  export let include: FieldMetadata[] = []
  export let exclude: FieldMetadata[] = []
  export let mode: 'create' | 'update' | 'readonly' = 'readonly'
  export let id: string | number | null = null

  let data = writable<Record<string, any>>({})
  let errors = writable<Record<string, string>>({})

  $: reset(mode)

  const resetErrors = () => {
    $errors = repo.fields
      .toArray()
      .map(c => c.key)
      .reduce((acc, key) => ({ ...acc, [key]: '' }), {})
  }

  const reset = async (_mode: 'create' | 'update' | 'readonly') => {
    resetErrors()
    if (!!id && (_mode === 'update' || _mode === 'readonly')) {
      $data = { ...(await repo.findId(id, { useCache: false })) }
    } else {
      $data = { ...repo.create() }
    }
  }

  const dispatch = createEventDispatcher()

  const dispatchCreate = (_data: any) => {
    dispatch('create', { _data })
  }

  const dispatchUpdate = (_data: any) => {
    dispatch('update', { _data })
  }

  const submit = async (e: Event) => {
    try {
      if (mode === 'update') {
        $data = await repo.save($data)
      } else if (mode === 'create') {
        $data = await repo.insert($data)
      }
    } catch (error) {
      // @ts-ignore
      $errors = { ...$errors, ...error.modelState }
      return
    }

    // inform others if everything is all right
    if (mode === 'update') {
      dispatchUpdate($data)
    } else if (mode === 'create') {
      dispatchCreate($data)
    }
  }

  const common = (field: FieldMetadata<any, any>) => {
    return {
      // id: field.key, // We don't really need id!
      name: field.key,
      disabled: field.dbReadOnly || field.options.allowApiUpdate === false,
      placeholder: field.options?.placeholder ?? '',
    }
  }

  const getValues = (field: any) => {
    return field.options?.valueConverter?.values
  }
</script>

<!-- error? -->

<form on:submit|preventDefault={submit} class="grid gap-4">
  {#each repo.fields.toArray().filter(f => {
    const isExcluded = exclude.map(c => c.key).includes(f.key)
    if (isExcluded) {
      return false
    }
    const isIncluded = include.map(c => c.key).includes(f.key)
    if (isIncluded) {
      return true
    }

    // good defaults?
    let with_readonly = false
    let with_allowNull = false

    if (mode === 'create') {
      with_readonly = false
      with_allowNull = false
    } else if (mode === 'update') {
      with_readonly = false
      with_allowNull = true
    }

    const allowNull = with_allowNull ? true : !f.allowNull
    const readOnly = with_readonly ? true : !f.dbReadOnly && f.options.allowApiUpdate === undefined

    return allowNull && readOnly
  }) as field}
    {@const inputType = field.inputType}
    <div class="grid gap-2">
      <div class="px-3 flex justify-between">
        <Label for={field.key}>{field.caption}</Label>
        <Label class="text-red-400">{$errors[field.key]}</Label>
      </div>
      {#if mode === 'readonly'}
        <Label>{field.displayValue($data)}</Label>
      {:else if inputType === 'checkbox'}
        <Checkbox {...common(field)} bind:checked={$data[field.key]} />
      {:else if inputType === 'select'}
        <!-- Whaiting for the "comming soon" feature -->
        <select
          style="background-color: #000;"
          {...common(field)}
          value={field.toInput($data[field.key])}
          on:change={e => {
            // @ts-ignore
            $data[field.key] = field.fromInput(e.target.value)
          }}
        >
          {#each getValues(field) ?? [] as { id, caption }}
            <option value={id}>{caption}</option>
          {/each}
        </select>
      {:else}
        <Input
          {...common(field)}
          type={inputType}
          value={field.toInput($data[field.key])}
          on:change={e => {
            // @ts-ignore
            $data[field.key] = field.fromInput(e.target.value)
          }}
        />
      {/if}
    </div>
  {/each}

  {#if mode !== 'readonly'}
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
    </div>
    <Button class="w-full" type="submit">{mode === 'create' ? 'Create' : 'Update'}</Button>
  {/if}
</form>
