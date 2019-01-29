namespace :deploy do
  desc 'Update permissions'
  task :permissions do
    on roles(:app) do
      execute "chown -R #{host.user}:#{host.user} #{current_path}"
      execute "chmod -R 770 #{current_path}"
      execute "chmod -R 770 #{shared_path}"
    end
  end
end

# Tasks
after 'deploy:symlink:release', 'deploy:permissions'
