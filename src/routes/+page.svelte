<script>
	import Counter from "$lib/components/Counter.svelte";
    import Button from "$lib/components/Button.svelte";
</script>
<main>
    
    <Counter />
    <br />
    <br />
    <Button onclick={() => alert('Button clicked!')}>Buy books</Button>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    }
</style>

  