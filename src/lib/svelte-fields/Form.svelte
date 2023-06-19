<script lang="ts">
  import { goto } from '$app/navigation'
  import { displayValue, fieldVisibility } from '$lib/remult-svelte/helper'
  import type { FieldMetadata, Repository } from 'remult'
  import { createEventDispatcher } from 'svelte'
  import { writable } from 'svelte/store'
  import Button from './Button/Button.svelte'
  import Input from './Input.svelte'

  export let repo: Repository<any>
  export let mode: 'create' | 'update' | 'readonly' = 'readonly'
  export let id: string | number | null = null
  export let redirect: string | null = null

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

  const dispatchCreate = async (_data: any) => {
    if (redirect) {
      await goto(redirect)
    } else {
      dispatch('create', { _data })
    }
  }

  const dispatchUpdate = async (_data: any) => {
    if (redirect) {
      await goto(redirect)
    } else {
      dispatch('update', { _data })
    }
  }

  const dispatchCancel = async (_data: any) => {
    if (redirect) {
      await goto(redirect)
    } else {
      dispatch('cancel', { _data })
    }
  }

  const submit = async (e: Event) => {
    try {
      if (mode === 'update') {
        $data = await repo.save({ ...$data })
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
      id: field.key,
      name: field.key,
      disabled: field.dbReadOnly || field.options.allowApiUpdate === false,
      placeholder: field.options?.placeholder ?? '',
    }
  }

  const getValues = (field: any) => {
    return field.options?.valueConverter?.values
  }
</script>

<form on:submit|preventDefault={submit}>
  <div
    class={repo.metadata.options.class ?? 'grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}
  >
    {#each repo.fields.toArray().filter(f => fieldVisibility(f, mode)) as field}
      {@const inputType = field.inputType}
      <div class="form-control">
        <label class="label" for={field.key}>
          <span class="label-text">{field.caption}</span>
          <span class="label-text-alt text-error">{$errors[field.key]}</span>
        </label>

        {#if mode === 'readonly'}
          <span class="h-12 pl-4 grid content-center">{displayValue(field, $data)}</span>
        {:else if inputType === 'select'}
          <select
            {...common(field)}
            value={field.toInput($data[field.key])}
            class="select select-bordered"
            on:change={e => {
              // @ts-ignore
              $data[field.key] = field.fromInput(e.target.value)
            }}
          >
            {#each getValues(field) ?? [] as { id, caption }}
              <option value={id}>{caption}</option>
            {/each}
          </select>
        {:else if inputType === 'checkbox'}
          <div class="h-12 pl-4 grid content-center">
            <input
              type="checkbox"
              {...common(field)}
              class="checkbox"
              bind:checked={$data[field.key]}
            />
          </div>
        {:else if typeof field.toInput($data[field.key]) === 'object'}
          <!-- JYC todo with a select (frontend, backend, ...)...   -->
          <span class="h-12 pl-4 grid content-center">{displayValue(field, $data)}</span>
        {:else}
          <Input
            class="input-bordered"
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
    <!-- {`grid ${entitySytleCols()} gap-4`} -->
    <div
      class={repo.metadata.options.classActions ??
        'grid justify-items-end col-span-1 sm:col-span-2 md:col-span-3'}
    >
      <div class="flex gap-4">
        {#if mode === 'readonly'}
          <Button on:click={() => (mode = 'update')} variant="neutral" type="button">Edit</Button>
        {:else}
          <span>
            <Button variant="success" type="submit">
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </span>
          {#if mode === 'update'}
            <span>
              <Button on:click={() => (mode = 'readonly')} variant="ghost" type="button">
                Cancel
              </Button>
            </span>
          {:else}
            <span>
              <Button on:click={() => dispatchCancel(null)} variant="ghost" type="button">
                Cancel
              </Button>
            </span>
          {/if}
        {/if}
      </div>
    </div>
  </div>
</form>
