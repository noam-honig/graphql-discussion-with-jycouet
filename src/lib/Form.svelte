<script lang="ts">
  import { type FieldMetadata, remult } from 'remult'
  import type { ClassType } from 'remult/classType'
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'
  import { writable } from 'svelte/store'

  export let entity: ClassType<any>
  export let mode: 'create' | 'update' | 'readonly' = 'readonly'
  export let id: string | number | null = null

  export let with_allowNull: boolean | undefined = undefined
  export let with_readonly: boolean | undefined = undefined
  export let with_hideInCreate: boolean | undefined = undefined

  const currentRepo = remult.repo(entity)

  let data = writable<Record<string, any>>({})
  let errors = writable<Record<string, string>>({})

  $: reset(mode)

  const resetErrors = () => {
    $errors = currentRepo.fields
      .toArray()
      .map(c => c.key)
      .reduce((acc, key) => ({ ...acc, [key]: '' }), {})
  }

  const reset = async (_mode: 'create' | 'update' | 'readonly') => {
    resetErrors()
    if (!!id && (_mode === 'update' || _mode === 'readonly')) {
      $data = { ...(await currentRepo.findId(id, { useCache: false })) }
    } else {
      $data = { ...currentRepo.create() }
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
        $data = await currentRepo.save($data)
      } else if (mode === 'create') {
        $data = await currentRepo.insert($data)
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

  const common = (node: any, field: FieldMetadata<any, any>) => {
    node['id'] = field.key
    node['name'] = field.key
    node['disabled'] = field.dbReadOnly
    node['placeholder'] = field.options?.placeholder ?? ''

    return {
      destroy() {
        // console.log('destroy common?')
      },
    }
  }

  const getValues = (field: any) => {
    return field.options?.valueConverter?.values
  }
</script>

<form on:submit|preventDefault={submit}>
  {#each currentRepo.fields.toArray().filter(c => {
    if (with_allowNull === undefined && with_readonly === undefined && with_hideInCreate === undefined) {
      if (mode === 'create') {
        with_readonly = false
        with_allowNull = false
        with_hideInCreate = true
      } else {
        with_readonly = false
        // with_allowNull = true
        with_allowNull = false
        with_hideInCreate = false
      }
    }
    const allowNull = with_allowNull ? true : !c.allowNull
    const readOnly = with_readonly ? true : !c.dbReadOnly
    const hideInCreate = with_hideInCreate ? !c.options?.hideInCreate : true

    return allowNull && readOnly && hideInCreate
  }) as field}
    <div class="field">
      <label for={field.key}>
        <p class="caption">
          <span>{field.caption}</span><span class="error">{$errors[field.key]}</span>
        </p>
        <div class="input">
          {#if mode === 'readonly'}
            <p style="padding-top: 0.6rem; padding-left: 0.6rem;">
              {field.displayValue($data)}
            </p>
          {:else if field.inputType === 'text'}
            <input use:common={field} type="text" bind:value={$data[field.key]} />
          {:else if field.inputType === 'number'}
            <input use:common={field} type="number" bind:value={$data[field.key]} />
          {:else if field.inputType === 'checkbox'}
            <div style="padding-top: 12px;">
              <input use:common={field} type="checkbox" bind:checked={$data[field.key]} />
            </div>
          {:else if field.inputType === 'date'}
            <input
              use:common={field}
              type="date"
              value={field.toInput($data[field.key])}
              on:change={e => {
                // @ts-ignore
                $data[field.key] = field.fromInput(e.target.value)
              }}
            />
          {:else if field.inputType === 'select'}
            <select
              use:common={field}
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
            {console.log(`field`, field)}

            <pre>{field.inputType} not managed!</pre>
          {/if}
        </div>
      </label>
    </div>
  {/each}
  {#if mode !== 'readonly'}
    <div class="buttonSubmit">
      <button type="submit">{mode === 'create' ? 'Create' : 'Update'}</button>
    </div>
  {/if}
</form>

<style>
  .error {
    color: red;
  }
  .field {
    margin-bottom: 1rem;
    width: 100%;
  }
  .caption {
    padding-left: 0.7rem;
    height: 1rem;
    display: flex;
    justify-content: space-between;
  }
  .input {
    height: 2rem;
  }
</style>
